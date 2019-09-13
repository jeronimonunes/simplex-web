export function unexhaustive(v: never): never {
    throw new Error('The code have reached a place where it shouldn\'t. It\'s a bug!');
}
