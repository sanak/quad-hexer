# package-tests

1. In upper project root folder, run:
    ```sh
    pnpm build
    pnpm pack
    ```
2. Move to this folder and run:
    ```sh
    pnpm install
    # pnpm dlx playwright install
    pnpm test
    ```

Note that this folder's `package.json` - `dependencies`/`quad-hexer` file path needs to be updated, if the project root version is updated.
