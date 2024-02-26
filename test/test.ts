interface Parent {
  /** Name prop */
  name: string;

  /**
   * Multiline comment for
   * some prop.
   */
  age: number;
}

interface ChildInterface extends Parent {
  label: string;
}

type ChildType = Parent & {
  someOther: string;
};
