import { escape } from "std/html/entities.ts";
import { getPath } from "../../../utils/path.ts";
import breadcrumb from "../breadcrumb.ts";

import type { Data, ResolvedField, Version } from "../../../types.ts";

interface Props {
  collection: string;
  document: string;
  fields: ResolvedField[];
  data: Data;
  src?: string;
  version?: Version;
}

export default function template(
  { collection, document, fields, data, src, version }: Props,
) {
  return `
<u-pagepreview data-src="${src}"></u-pagepreview>
${
    breadcrumb(version, [
      collection,
      getPath("collection", collection),
    ], "Editing file")
  }

<u-form>
  <header class="header">
    <h1 class="header-title">
      Editing file
      <input
        class="input is-inline"
        id="_id"
        type="text"
        name="_id"
        value="${document}"
        placeholder="Rename the file…"
        form="form-edit"
        aria-label="File name"
        required
      >
    </h1>
  </header>
  <form
    action="${getPath("collection", collection, "edit", document)}"
    method="post"
    class="form"
    enctype="multipart/form-data"
    id="form-edit"
  >
    ${
    fields.map((field) => `
        <${field.tag}
          data-nameprefix="changes"
          data-value="${escape(JSON.stringify(data[field.name] ?? null))}"
          data-field="${escape(JSON.stringify(field))}"
        >
        </${field.tag}>
      `).join("")
  }
    <footer class="footer ly-rowStack is-responsive">
      <button class="button is-primary" type="submit">
        <u-icon name="check"></u-icon>
        Save changes
      </button>
      <u-confirm data-message="Are you sure?">
        <button
          class="button is-secondary"
          type="submit"
          formAction="${
    getPath(
      "collection",
      collection,
      "delete",
      document,
    )
  }"
        >
          <u-icon name="trash"></u-icon>
          Delete
        </button>
      </u-confirm>
    </footer>
  </form>
</u-form>
  `;
}