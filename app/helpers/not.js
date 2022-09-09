import { helper } from '@ember/component/helper';

export function not([a, b]) {
  return a !== b;
}
export default helper(not);
