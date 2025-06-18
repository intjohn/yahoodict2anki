import { loadUserOptions, type UserOptions } from '../../utils/userOptions';

let options: UserOptions | null = null;

export const getOptions = async (): Promise<UserOptions> => {
  if (!options) {
    options = await loadUserOptions();
  }
  return options;
};
