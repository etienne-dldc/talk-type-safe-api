declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module '*.dy' {
  type Folder = { [key: string]: string | Folder };

  let DocsyDoc: Folder;
  export default DocsyDoc;
}
