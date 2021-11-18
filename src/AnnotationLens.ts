import * as vscode from "vscode";
import { Annotation } from "./Annotation";

export class AnnotationLens extends vscode.CodeLens {
  public constructor(annotation: Annotation) {
    if (annotation.to.length === 1) {
      super(annotation.from.location.range, {
        command: "editor.action.goToLocations",
        title: `@Implements ${annotation.to[0].name}`,
        arguments: [
          annotation.from.location.uri,
          annotation.from.location.range.start,
          [annotation.to[0].location],
          "goto",
        ],
      });
    } else {
      super(annotation.from.location.range, {
        command: "editor.action.peekLocations",
        title: `@Implements Multiple...`,
        arguments: [
          annotation.from.location.uri,
          annotation.from.location.range.start,
          annotation.to.map((a) => a.location),
          "peek",
        ],
      });
    }
  }
}
