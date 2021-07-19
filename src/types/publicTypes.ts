import {
  DasSupportedNetwork,
  RequestArguments,
} from '.';

export type DasSupportedNetworks = typeof DasSupportedNetwork.type

export type NamingServiceSource = {url?: string, provider?: Provider}; // data source，either provider or url

export type DasSource = NamingServiceSource & {
  network?: DasSupportedNetworks
}

export enum NamingServiceName {
  DAS = 'DAS',
}

export type ResolutionMethod = NamingServiceName

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export interface Provider {
  request: (request: RequestArguments) => Promise<unknown>;
}
export type CryptoRecords = Record<string, string>;
