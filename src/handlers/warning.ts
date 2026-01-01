export function warning(message: string | string[]): void {
  if (Array.isArray(message)) {
    console.log('nestjs-prisma-graphql:');
    console.log(message.join('\n'));
  } else {
    console.log('nestjs-prisma-graphql:', message);
  }
}
