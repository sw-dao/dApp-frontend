// https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2

import PropTypes from 'prop-types';
import React from 'react';

interface YoutubeEmbedProps {
	embedId: string;
	title: string;
	width?: string;
	height?: string;
}

export const YoutubeEmbed = ({
	embedId,
	title,
	width = '400px',
	height = '300px',
}: YoutubeEmbedProps): JSX.Element => (
	<div className="video-responsive">
		<iframe
			width={width}
			height={height}
			src={`https://www.youtube.com/embed/${embedId}`}
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			title={title}
		/>
	</div>
);

YoutubeEmbed.propTypes = {
	embedId: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};
