import * as vscode from "vscode";

export class Annotation {
  public constructor(
    public readonly from: vscode.SymbolInformation & vscode.DocumentSymbol,
    public readonly to: Array<vscode.SymbolInformation & vscode.DocumentSymbol>
  ) {}
}
