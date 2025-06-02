<script>
  import RecursiveGrid from "./RecursiveGrid.svelte";
  import Content from "./content/Content.svelte";
  import { recursiveGridLogger } from "./utils/logger"; // 引入 recursiveGridLogger

  // 从父组件接收的 props
  // dataContainer: 整个应用的数据容器
  // node: 当前 RecursiveGrid 组件要渲染的节点数据
  // gap: 网格项之间的间距，默认为 0
  let { dataContainer, node, gap = 0 } = $props();
  recursiveGridLogger.debug(
    `RecursiveGrid.svelte: 接收到 props - node ID: ${node?.id?.join("-") || "N/A"}, gap: ${gap}`
  );
</script>

<!--
  使用 #key dataContainer.name 来强制在 dataContainer.name 变化时重新渲染整个组件树。
  这对于响应式地切换不同的数据结构或布局非常有用。
-->
{#key dataContainer.name}
  <!--
    如果当前节点有子节点，则渲染一个 CSS Grid 容器。
    根据节点数据动态设置 grid-template-rows, grid-template-columns, grid-template-areas 和 grid-area 样式。
    然后递归渲染每个子节点。
  -->
  {#if node?.children}
    <div
      style={`
        display: grid;
        ${node?.gridTemplateRows ? `grid-template-rows: ${node.gridTemplateRows};` : ""}
        ${node?.gridTemplateColumns ? `grid-template-columns: ${node.gridTemplateColumns};` : ""}
        ${node?.gridTemplateAreas && node.gridTemplateAreas.trim() !== "" ? `grid-template-areas: ${node.gridTemplateAreas};` : ""}
        ${node?.gridArea ? `grid-area: ${node.gridArea};` : ""}
        gap: ${gap}px;
        width: 100%;
        height: 100%;
      `}
    >
      {#each node?.children as child (child.id.join(","))}
        <RecursiveGrid {dataContainer} node={child} />
      {/each}
    </div>
  {:else}
    <!--
      如果当前节点没有子节点，则渲染一个内容容器。
      根据节点数据设置 grid-area 样式。
      使用 #key !!node.refreshKey 来强制在 node.refreshKey 变化时重新渲染 Content 组件。
      这通常用于当节点数据内部发生变化，但 Svelte 无法自动检测到时，强制更新组件。
    -->
    <div
      style={`
        ${node?.gridArea ? `grid-area: ${node.gridArea};` : ""}
        width: 100%;
        height: 100%;
      `}
    >
      {#key !!node.refreshKey}
        <Content {dataContainer} {node}></Content>
      {/key}
    </div>
  {/if}
{/key}
