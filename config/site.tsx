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