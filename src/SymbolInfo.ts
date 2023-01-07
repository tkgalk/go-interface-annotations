import * as vscode from "vscode";

export class SymbolInfo {
  public readonly symbol: vscode.SymbolInformation & vscode.DocumentSymbol;

  public static async create(
    symbol: vscode.SymbolInformation & vscode.DocumentSymbol
  ): Promise<SymbolInfo> {
    const createdSymbolInfo = new SymbolInfo(symbol);
    return createdSymbolInfo;
  }

  public static async getSymbol(
    location: vscode.Location
  ): Promise<vscode.SymbolInformation & vscode.DocumentSymbol> {
    const documentSymbols = (await vscode.commands.executeCommand<
      (vscode.SymbolInformation & vscode.DocumentSymbol)[]
    >("vscode.executeDocumentSymbolProvider", location.uri))!;
    return documentSymbols.find((documentSymbol) =>
      documentSymbol.range.start.isEqual(location.range.start)
    ) as vscode.SymbolInformation & vscode.DocumentSymbol;
  }

  private constructor(
    symbol: vscode.SymbolInformation & vscode.DocumentSymbol
  ) {
    this.symbol = symbol;

    if (
      this.symbol.kind !== vscode.SymbolKind.Class &&
      this.symbol.kind !== vscode.SymbolKind.Struct &&
      this.symbol.kind !== vscode.SymbolKind.Interface
    ) {
      throw new Error("Expected struct or interface");
    }
  }
}
