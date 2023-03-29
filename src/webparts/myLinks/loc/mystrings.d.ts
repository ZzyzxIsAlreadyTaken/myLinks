declare interface IMyLinksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  MyLinksLabel: string;
  MyAdminLinksLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'MyLinksWebPartStrings' {
  const strings: IMyLinksWebPartStrings;
  export = strings;
}
