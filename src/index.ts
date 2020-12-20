import {languages, ExtensionContext} from 'coc.nvim';
import {DocumentFilter} from 'vscode-languageserver-protocol';

import {ProtobufDefinitionProvider} from './DefinitionProvider';

export async function activate(context: ExtensionContext) {
    const mode: DocumentFilter[] = [
        {language: 'proto', scheme: 'file'},
    ];

    context.subscriptions.push(
        languages.registerDefinitionProvider(
            mode,
            new ProtobufDefinitionProvider(),
        ),
    );
}
