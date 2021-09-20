# Treeview example in Markdown

This uses the `<details>` and `<summary>` HTML5 entities.

## Example 1

OK, it turns out it is better to use pure HTML for the `<details>` elements
rather than mixing in Markdown. This is because the Markdown processor has
a limit on nesting depth ... or maybe because of where the Markdown processor
puts the closing `</ul>` tags ... I'm not sure really. But to avoid problems,
just use HTML, e.g.:

<ul>
<li><details><summary>Fruits</summary>
  <ul>
    <li>Oranges</li>
    <li>Bananas</li>
    <li>Grapefruits</li>
    <li><details><summary>Berries</summary>
      <ul>
        <li>Strawberries</li>
        <li>Blueberries</li>
        <li>Boysenberries</li>
        <li>Mulberries</li>
        <li>Goji berries</li>
        <li><details><summary>Other Berries</summary>
          <ul>
            <li>Blackberries</li>
            <li>Raspberries</li>
            <li>Cranberries</li>
            <li>Lingonberries</li>
            <li>Elderberries</li>
            <li>Huckleberries</li>
          </ul>
          </details>
        </li>
      </ul>
      </details>
    </li>
  </ul>
</details>
</li>
</ul>
