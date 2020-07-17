// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef,
  useMemo
} from 'react';

import { useActiveSpeakersState } from '../ActiveSpeakersProvider';
import { useRemoteVideoTileState } from '../RemoteVideoTileProvider';

interface FeaturedTileState {
  tileId: number | null;
}

const FeaturedTileContext = createContext<FeaturedTileState | null>(null);

const FeaturedVideoTileProvider: React.FC = ({ children }) => {
  const { attendeeIdToTileId } = useRemoteVideoTileState();
  const activeAttendees = useActiveSpeakersState();
  const activeTileRef = useRef<number | null>(null);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    const activeId = activeAttendees[0];

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (!activeId) {
      activeTileRef.current = null;
      setActiveTile(null);
      return;
    }

    const tileId = attendeeIdToTileId[activeId];

    if (!tileId) {
      if (activeTileRef.current) {
        timeout.current = setTimeout(() => {
          activeTileRef.current = null;
          setActiveTile(null);
        }, 2000);
      }

      return;
    }

    if (tileId === activeTileRef.current) {
      return;
    }

    activeTileRef.current = tileId;
    setActiveTile(tileId);
  }, [attendeeIdToTileId, activeAttendees]);

  const value = useMemo(
    () => ({
      tileId: activeTile
    }),
    [activeTile]
  );

  return (
    <FeaturedTileContext.Provider value={value}>
      {children}
    </FeaturedTileContext.Provider>
  );
};

function useFeaturedTileState(): FeaturedTileState {
  const state = useContext(FeaturedTileContext);

  if (!state) {
    throw new Error(
      'useFeaturedTileState must be used within an FeaturedVideoTileProvider'
    );
  }

  return state;
}

export { FeaturedVideoTileProvider, useFeaturedTileState };