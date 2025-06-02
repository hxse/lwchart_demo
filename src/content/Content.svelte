<script>
  import Lwchart from "./Chart.svelte";
  import TextButton from "./TextButton.svelte";
  let { dataContainer, node } = $props(); // level 用于可选的全局样式
</script>

{#if node.content === "hello_world"}
  <TextButton {dataContainer} {node}></TextButton>
{:else if node.content === "lwchart"}
  <Lwchart {dataContainer} {node} />
{:else}
  <div
    style={`
    text-align: left;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border: 1px solid blue;
  `}
  >
    test
  </div>
{/if}
