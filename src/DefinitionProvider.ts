import {workspace, DefinitionProvider} from 'coc.nvim';
import {Location, TextDocument, Position, Range} from 'vscode-languageserver-protocol';
import {EOL} from 'os';

function getCurrentWord(line: string, offset: number): string {
    let start = 0;
    let end = 0;
    for (let i = 0; i < line.length; i++) {
        const char = line.charAt(i);

        if (i < offset) {
            if (char === ' ') {
                // TODO: why is it offset?
                start = i + 1;
                continue;
            };
        } else {
            if (char === ' ') {
                end = i;
                break;
            };
        }
    }

    return line.slice(start, end);
}

function getMessageDefinitionStartPosition(messageName: string, fileContent: string): Position | null {
    const pattern = new RegExp(`message ${messageName}`);
    const allLines = fileContent.split(EOL);

    let match: RegExpMatchArray | null = null;
    let matchLineOffset: number = 0;
    let matchLineIndex: number = 0;

    for (let i = 0; i <= allLines.length; i++) {
        const line = allLines[i];
        match = line.match(pattern);

        if (match) {
            matchLineIndex = i;
            matchLineOffset = match.index as number;
            break;
        }
    }

    if (match) {
        return Position.create(
            matchLineIndex,
            matchLineOffset,
        );
    }

    return null;
}

export class ProtobufDefinitionProvider implements DefinitionProvider {
    async provideDefinition(
        document: TextDocument,
        position: Position,
    ): Promise<Location | null> {
        const {nvim} = workspace;
        const currentLine = await nvim.getLine();

        const content = document.getText();
        const lineOffset = position.character;

        const word = getCurrentWord(currentLine, lineOffset);

        const messageStartPostion = getMessageDefinitionStartPosition(word, content);

        if (messageStartPostion) {
            const targetRange: Range = {
                start: messageStartPostion,
                end: messageStartPostion,
            };
            return Location.create(
                document.uri,
                targetRange,
            );
        }

        return null;
    }
}
