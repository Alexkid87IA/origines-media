// Resolve article links against published CMS documents, without changing the source text.
export const ARTICLE_MARK_DEFS = `
  markDefs[] {
    ...,
    _type == "internalLink" => { "slug": reference->slug.current },
    _type == "link" && href match "/article/*" => {
      "missingArticle": !defined(*[_type == "production" && slug.current == string::split(string::split(string::split(^.href, "?")[0], "#")[0], "/")[2]][0]._id)
    }
  }
`;
