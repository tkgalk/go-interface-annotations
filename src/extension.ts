import * as vscode from "vscode";
import { AnnotationLensProvider } from "./AnnotateLensProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [{ language: "go" }],
      new AnnotationLensProvider()
    )
  );
}

export function deactivate() {}
