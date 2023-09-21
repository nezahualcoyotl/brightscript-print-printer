import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "brightscript-print-printer" is now active!');

	let disposable = vscode.commands.registerCommand('brightscript-print-printer.printAll', () => {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const doc = editor.document;
			const text = doc.getText();

			const signatureRegex = /^(sub|function) (\w+)\((.*)\)(?: as \w+)?$/gm;
			let replacedText = text.replace(signatureRegex, (match, _, funcOrSubName, params) => {
				let replacement = `${match}\n    print ">>>>>>>>>>>>>>>>>>>>>>>>>> FUNCTION ${funcOrSubName}() "`;

				if (typeof params === 'string') {
					params.split(',').forEach(parameter => {
						const paramName = parameter.trim().split(' ')[0];
						replacement += `\n    print ">>>>>>>>>>>>>>>>>>>>>>>>>> PARAM ${paramName} " ${paramName}`;
					});
				}

				return replacement;
			});

			const returnRegex = /^(\s*)return (.+)$/gm;
			replacedText = replacedText.replace(returnRegex, (match, indent, returnValue) => {
				return `${indent}print ">>>>>>>>>>>>>>>>>>>>>>>>>> RETURN ${returnValue}  " ${returnValue}\n${match}`;
			});

			const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(text.length));
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, replacedText);
			});
		} else {
			vscode.window.showInformationMessage('Open a BrightScript file to use this extension.');
		}


	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
