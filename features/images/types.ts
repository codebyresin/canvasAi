export interface CanvaImage {
  id: string;
  alt_description: string | null;
  urls: {
    small: string;
    regular: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
}

export interface ImagesPageResponse {
  data: CanvaImage[];
  page: number;
  perPage: number;
  nextPage: number | null;
  hasMore: boolean;
}
