export const siteConfig = {
    name: "Sarah Paluszny Travel Photo Gallery",
    url: "https://www.sarahpaluszny.com",
    description: "A collection of photographs, I’ve attained while traveling the world",
    author: "Sarah Paluszny",
    links: {
        github: "https://github.com/spaluszny",
        linkedIn: "https://www.linkedin.com/in/sarah-paluszny/",
        leetCode: "https://leetcode.com/u/spaluszny/",
        email: "sarahpaluszny@gmail.com",
        website: "https://www.sarahpaluszny.com"
    },
};

export type SiteConfig = typeof siteConfig

export const googleOAuthConfig = {
  web: {
    client_id: "167533177382-alk9bp4cagp82ibjse3jl4cp0jpnqrt1.apps.googleusercontent.com",
    project_id: "travel-photography-blog",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    javascript_origins: [
      "http://localhost:3000"
    ]
  }
} as const;

export interface GoogleOAuthConfig {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    javascript_origins: string[];
  };
}