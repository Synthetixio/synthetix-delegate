export interface FetchStatus {
	lastUpdated: number;
	loadingError: string | null;
	isLoading: boolean;
	isLoaded: boolean;
	isRefreshing: boolean;
}
