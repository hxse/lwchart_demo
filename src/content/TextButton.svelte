<script>
  import { updateParentLayout, updateParentLayout2 } from "../data/callback/layoutCallbacks";

  import {
    setDataLayout,
    updateDataLayout,
    changeDataLayout,
    changeDataPeriod,
    changeDataRefresh,
  } from "../data/callback/dataCallbacks";

  let { dataContainer, node } = $props();
  let dict = {
    updateParentLayout: () => updateParentLayout(dataContainer, node.id),
    updateParentLayout2: () => updateParentLayout2(dataContainer, node.id),
    setDataLayout: () => setDataLayout(dataContainer, node.id),
    updateDataLayout: () => updateDataLayout(dataContainer, node.id),
    changeDataLayout: () => changeDataLayout(dataContainer, node.id, node.params.paramName),
    changeDataPeriod: () => changeDataPeriod(dataContainer, node.id, node.params.paramName),
    changeDataRefresh: () => changeDataRefresh(dataContainer, node.id),
  };
  let callback = dict[node.params.callback];
</script>

<div
  style={`
text-align: left;
width: calc(100% - 2px);
height: calc(100% - 2px);
border: 1px solid red;
`}
>
  {node.params.text}
  {node.id.join(",")}
  {#if callback}
    <button onclick={() => callback()}> button </button>
  {/if}
</div>
