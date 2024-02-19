import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFluentUiDropdownProps {
  description: string;
  webURL: string;
  singleValueOptions: any;
  multiValueOptions: any;
  listGuid: string;
  listGuid2: string;
  context: WebPartContext;
  parentCallback: (childdata: boolean) => void;
}
