interface Parent {
  /** Name prop */
  name: string;
  age: number;
}

interface Child extends Parent {
  label: string;
}

type Child2 = Parent & {
  someOther: string;
};
