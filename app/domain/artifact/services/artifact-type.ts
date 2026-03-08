import type { Artifact } from '../models/artifact.types';

export const isImageArtifact = (artifact: Artifact) =>
  artifact.content_type?.startsWith('image');
export const isVideoArtifact = (artifact: Artifact) =>
  artifact.content_type?.startsWith('video');
export const isAudioArtifact = (artifact: Artifact) =>
  artifact.content_type?.startsWith('audio');
