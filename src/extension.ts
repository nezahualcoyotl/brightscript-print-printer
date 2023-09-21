import * as vscode from "vscode";

function printFunctions() {
  applyTextTransformation(appendFunctionNames);
}

function printParameters() {
  applyTextTransformation(appendParameters);
}

function printReturn() {
  applyTextTransformation(appendReturns);
}

function printFunctionsAndParameters() {
  applyTextTransformation((text) =>
    appendParameters(appendFunctionNames(text))
  );
}

function printFunctionsAndReturn() {
  applyTextTransformation((text) => appendReturns(appendFunctionNames(text)));
}

function printAll() {
  applyTextTransformation((text) =>
    appendReturns(appendParameters(appendFunctionNames(text)))
  );
}

function applyTextTransformation(transformation = (text: string) => text) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const doc = editor.document;
    const text = doc.getText();
    const replacedText = transformation(text);
    const fullRange = new vscode.Range(
      doc.positionAt(0),
      doc.positionAt(text.length)
    );
    editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, replacedText);
    });
  } else {
    vscode.window.showInformationMessage(
      "Open a BrightScript file to use this extension."
    );
  }
}

function appendFunctionNames(text = "") {
  const signatureRegex = /^(sub|function) (\w+)\((.*)\)(?: as \w+)?$/gm;
  return text.replace(signatureRegex, (match, _, funcOrSubName, params) => {
    if (typeof params === "string" && params.trim() === "") {
      return `${match}\n    print ">>>>>>>>>>>>>>>>>>>>>>>>>> FUNCTION ${funcOrSubName}() "`;
    } else {
      return match; // Just return the original match if parameters are present
    }
  });
}

function appendParameters(text = "") {
  const signatureRegex = /^(sub|function) (\w+)\((.*)\)(?: as \w+)?$/gm;
  return text.replace(signatureRegex, (match, _, funcOrSubName, params) => {
    let replacement = match;

    if (typeof params === "string" && params.trim() !== "") {
      replacement += `\n    print ">>>>>>>>>>>>>>>>>>>>>>>>>> FUNCTION ${funcOrSubName}() "`;
      params.split(",").forEach((parameter) => {
        const paramName = parameter.trim().split(" ")[0];
        if (paramName) {
          replacement += `\n    print ">>>>>>>>>>>>>>>>>>>>>>>>>> PARAM ${paramName} " ${paramName}`;
        }
      });
    }

    return replacement;
  });
}

function appendReturns(text = "") {
  const returnRegex = /^(\s*)return (.+)$/gm;
  return text.replace(returnRegex, (match, indent, returnValue) => {
    return `${indent}print ">>>>>>>>>>>>>>>>>>>>>>>>>> RETURN ${returnValue}  " ${returnValue}\n${match}`;
  });
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "brightscript-print-printer" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "brightscript-print-printer.printFunctions",
      printFunctions
    ),
    vscode.commands.registerCommand(
      "brightscript-print-printer.printParameters",
      printParameters
    ),
    vscode.commands.registerCommand(
      "brightscript-print-printer.printReturn",
      printReturn
    ),
    vscode.commands.registerCommand(
      "brightscript-print-printer.printFunctionsAndParameters",
      printFunctionsAndParameters
    ),
    vscode.commands.registerCommand(
      "brightscript-print-printer.printFunctionsAndReturn",
      printFunctionsAndReturn
    ),
    vscode.commands.registerCommand(
      "brightscript-print-printer.printAll",
      printAll
    )
  );
}

export function deactivate() {}
