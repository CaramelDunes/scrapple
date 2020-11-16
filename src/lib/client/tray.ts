// Assumes oldTray.length == 8.
// TODO Optimize
export function trayFromLetters(letters: string[], oldTray: string[]): string[] {
    const oldTrayCopy = Array.of(...oldTray);
    const tray = ['', '', '', '', '', '', '', ''];

    const leftovers = [];

    for (const letter of letters) {
        const i = oldTrayCopy.indexOf(letter);

        if (i === -1) leftovers.push(letter);
        else {
            tray[i] = letter;
            oldTrayCopy[i] = '';
        }
    }

    for (const letter of leftovers) {
        const i = tray.indexOf('');
        tray[i] = letter;
    }

    return tray;
}