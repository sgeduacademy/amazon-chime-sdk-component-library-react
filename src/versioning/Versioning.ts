// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import VERSION from './version';

export class Versioning {
  /**
   * Return string representation of SDK name
   */
  static get sdkName(): string {
    return 'amazon-chime-sdk-component-library-react';
  }

  /**
   * Return string representation of SDK version
   */
  static get sdkVersion(): string {
    return VERSION.semverString;
  }
}
