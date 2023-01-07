import * as vscode from "vscode";
import { Annotation } from "./Annotation";

export class AnnotationLens extends vscode.CodeLens {
  public constructor(annotation: Annotation) {
    const from = annotation.from;
    if (annotation.to.length === 1) {
      super(from.location.range, {
        command: "editor.action.goToLocations",
        title: `@Implements ${annotation.to[0].name}`,
        arguments: [
          from.location.uri,
          from.location.range.start,
          [annotation.to[0].location],
          "goto",
        ],
      });
    } else {
      super(from.location.range, {
        command: "editor.action.peekLocations",
        title: `@Implements Multiple...`,
        arguments: [
          from.location.uri,
          from.location.range.start,
          annotation.to.map((a) => a.location),
          "peek",
        ],
      });
    }
  }
}
