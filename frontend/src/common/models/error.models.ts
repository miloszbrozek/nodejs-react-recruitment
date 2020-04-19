export interface ErrorData {
    message: string;
    status?: number;
}

export interface ErrorMappingConfig {
    [index: number]: string;
    genericMessage?: string
}