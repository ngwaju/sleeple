<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use the origin root for Lovable hosting and `/sleeple/` only when `DEPLOY_TARGET=github-pages`; managed sign-in returns must resolve to a public page on the current host.
- Prerender sign-in and account shells along with public pages for static hosting; private account data loads only in the browser after authentication.
