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
    const structsAndInterfaces = await this.getDocumentStructsAndInterfaces(
      document
    );

    const results: AnnotationLens[] = [];
    for (const structOrInterface of structsAndInterfaces) {
      const symbolInfo = await SymbolInfo.create(structOrInterface);
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return [];
      }

      const locations =
        (await vscode.commands.executeCommand<vscode.Location[]>(
          "vscode.executeImplementationProvider",
          activeEditor.document.uri,
          symbolInfo.symbol.location.range.start
        )) ?? [];

      const symbols = await Promise.all(locations.map(SymbolInfo.getSymbol));

      console.log(`${symbolInfo.symbol.name} - ${symbols.length}`);
      if (symbols.length === 0) {
        continue;
      }
      const annotation = new Annotation(symbolInfo.symbol, symbols);
      results.push(new AnnotationLens(annotation));
    }

    return results;
  }

  private async getDocumentStructsAndInterfaces(document: vscode.TextDocument) {
    const symbols = (await vscode.commands.executeCommand<
      (vscode.SymbolInformation & vscode.DocumentSymbol)[]
    >("vscode.executeDocumentSymbolProvider", document.uri))!.filter(
      (symbol) =>
        symbol.kind === vscode.SymbolKind.Struct ||
        symbol.kind === vscode.SymbolKind.Interface
    );
    return symbols;
  }
}
