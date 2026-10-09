import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { portfolio } from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    {title: portfolio.seo.title},
    {name: "description", content: portfolio.seo.description},
    {property: "og:title", content: portfolio.seo.title},
    {property: "og:description", content: portfolio.seo.description},
    {property: "og:type", content: "website"},
    {name: "twitter:card", content: "summary_large_image"},
  ]}),
  component: PortfolioPage,
});
