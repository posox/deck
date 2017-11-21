import { IProviderSettings, SETTINGS } from '@spinnaker/core';

export interface IHelmProviderSettings extends IProviderSettings {
  defaults: {
    account?: string;
  };
}

export const HelmProviderSettings: IHelmProviderSettings = <IHelmProviderSettings>SETTINGS.providers.helm || { defaults: {} };
if (HelmProviderSettings) {
  HelmProviderSettings.resetToOriginal = SETTINGS.resetProvider('helm');
}
