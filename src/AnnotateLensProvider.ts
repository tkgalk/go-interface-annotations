import * as vscode from "vscode";
import { Annotation } from "./Annotation";
import { AnnotationLens } from "./AnnotationLens";
import { SymbolInfo } from "./SymbolInfo";

export class AnnotationLensProvider
  implements vscode.CodeLensProvider<AnnotationLens>
{
  public async provideCodeLenses(
    document: vscode.TextDocument
  ): Promise<vscode.CodeLens[]> {
    const goSymbols = await this.getGoSymbols(document);

    const results: AnnotationLens[] = [];
    for (const goSymbol of goSymbols) {
      const symbolInfo = await SymbolInfo.create(goSymbol);
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return [];
      }

      const locations = await this.getSymbolLocations(activeEditor, symbolInfo) ?? [];
      const symbols = await Promise.all(locations.map(SymbolInfo.getSymbol));
      if (symbols.length === 0) {
        continue;
      }

      const annotation = new Annotation(symbolInfo.symbol, symbols);
      results.push(new AnnotationLens(annotation));
    }

    return results;
  }

  private async getSymbolLocations(te: vscode.TextEditor, si: SymbolInfo): Promise<vscode.Location[]> {
    return vscode.commands.executeCommand<vscode.Location[]>(
      "vscode.executeImplementationProvider",
      te.document.uri,
      si.symbol.location.range.start
    );
  }

  private async getGoSymbols(document: vscode.TextDocument) {
    const symbols = (await vscode.commands.executeCommand<
      (vscode.SymbolInformation & vscode.DocumentSymbol)[]
    >("vscode.executeDocumentSymbolProvider", document.uri))!.filter(
      (symbol) =>
        symbol.kind === vscode.SymbolKind.Class ||
        symbol.kind === vscode.SymbolKind.Struct ||
        symbol.kind === vscode.SymbolKind.Interface
    );
    return symbols;
  }
}
