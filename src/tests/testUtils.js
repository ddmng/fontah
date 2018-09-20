
export const startTests = (testSet) => {
    testSet.forEach(t => {
      test(t.description, () => {
        expect(t.f(...t.args)).toBe(t.result);
      });
    })
  }
  