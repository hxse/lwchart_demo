import { replaceGridAreas } from "./utils/gridUtils";

function TestReplaceGridAreas() {
  const runTest = (testName, gridTemplate, ids, expected, warn = false) => {
    console.log(`\n--- ${testName} ---`);
    console.log(" 原始 gridTemplateAreas:", gridTemplate);
    console.log(" ID 数组:", ids);
    const result = replaceGridAreas(gridTemplate, ids);
    console.log(" 替换后的 gridTemplateAreas:", result);
    if (warn) {
      console.log(" 预期(带警告):", expected);
    } else {
      console.log(" 预期:", expected);
    }
    if (result === expected) {
      console.log(" ✅ 测试通过");
    } else {
      console.error(" ❌ 测试失败");
    }
  };

  const runAllTests = () => {
    runTest("测试 1 (字母)", `"a b" "c d"`, ["one", "two", "three", "four"], `"one two" "three four"`);
    runTest("测试 2 (混合)", `"header header" "sidebar main"`, ["top", "side", "content"], `"top top" "side content"`);
    runTest("测试 3 (重复)", `"left main right" "left bottom right"`, ["l", "m", "r", "b"], `"l m r" "l b r"`);
    runTest("测试 4 (ID 不足)", `"a b c"`, ["alpha", "beta"], `"alpha beta ."`, true);
    runTest("测试 5 (ID 超出)", `"x y"`, ["p", "q", "r", "s"], `"p q"`);
    runTest("测试 6 (数字也有效)", `"0 1" "2 1"`, ["first", "second", "third"], `"first second" "third second"`);
    runTest(
      "测试 7 (带连字符)",
      `"main-header ad" "content ad"`,
      ["top-area", "side", "hello_world"],
      `"top-area side" "hello_world side"`
    );
  };

  runAllTests();
}
// TestReplaceGridAreas();
