import {ResolutionMethod} from './types/publicTypes';

/**
 * @internal
 */
export abstract class NamingService {
  abstract owner(account: string): Promise<string>;
  abstract resolver(account: string): Promise<string>;
  abstract namehash(account: string): string;
  abstract childhash(parentHash: string, label: string): string;
  abstract isSupportedDomain(account: string): boolean;
  abstract record(account: string, key: string): Promise<string>;
  abstract records(
    account: string,
    keys: string[],
  ): Promise<Record<string, string>>;
  abstract serviceName(): ResolutionMethod;
  abstract twitter(account: string): Promise<string>;
  abstract reverse(
    address: string,
    currencyTicker: string,
  ): Promise<string | null>;
  abstract allRecords(account: string): Promise<Record<string, string>>;
  abstract isRegistered(account: string): Promise<boolean>;
}
