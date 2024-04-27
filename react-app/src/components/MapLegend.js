const MapLegend = () => {

	return (
		<div className="map-legend">
			<div className='owner'>Your Land</div>
			<div className='small-price'>Price &lt; 75</div>
			<div className='medium-price'>Price &lt; 125</div>
			<div className='large-price'>Price &lt; 200</div>
		</div>
	);
}

export default MapLegend;