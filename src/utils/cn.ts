import cx from 'classnames';
import { twMerge } from 'tailwind-merge';

export default function cn(...inputs:string[]) {
  return twMerge(cx(inputs));
}
