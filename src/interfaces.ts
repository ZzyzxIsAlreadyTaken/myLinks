export interface IMYLINKS {
    Id: number;
    Title: string;
    Link: string;
    Icon: string;  
    openinnewtab: boolean;
    edit: boolean;
    add: boolean;
}

export interface IMYADMINLINKS{
    Id: number;
    Title: string;
    Link: string;
    openinnewtab: boolean;
    Valgfri: boolean;
}