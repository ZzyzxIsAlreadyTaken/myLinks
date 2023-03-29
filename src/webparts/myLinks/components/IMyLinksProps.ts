import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMyLinksProps {
  description: string;
  context: WebPartContext;
  listTitleMylinks: string;
  listGuid: string;
  listTitleAdminlinks: string;
  listGuid2: string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
