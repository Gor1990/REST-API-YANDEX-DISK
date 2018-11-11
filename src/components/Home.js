import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

import takeFolder from '../requests/takeFolder';
import { setDirectory, setLoading } from '../actions';

import File from './File';
import Folder from './Folder';

const FIRST_BEADCRUMB = {
	name: "Home",
	active: true,
	link: '/',
};

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			breadcrumbs: [FIRST_BEADCRUMB],
		};
	}

	componentDidMount () {
		takeFolder(this.props.token, encodeURIComponent('/'))
			.then(data => {
				this.props.setDirectory('/', data._embedded.items);
			});
	};

	componentWillReceiveProps(newProps) {
		if (newProps.previousRoute !== this.props.previousRoute) {
			let route = window.location.pathname;
			if (route.length > 1 && route[0] === '/') {
				route = route.substring(1, route.length);
			}

			this.props.setLoading();
					takeFolder(this.props.token, route)
						.then(data => {
							this.props.setDirectory(route, data._embedded.items);
						});
		}

		if (newProps.currentDirectory !== this.props.currentDirectory) {
			if (newProps.currentDirectory === '/') {
				this.setState({
					breadcrumbs: [FIRST_BEADCRUMB],
				});

				return;
			}

			const path = newProps.currentDirectory.split('/');
			const breadcrumbs = path.map((pathName, index) => {
				let breadcrumb;
				if (index === 0) {
					breadcrumb = JSON.parse(JSON.stringify(FIRST_BEADCRUMB));
				} else {
					breadcrumb ={
						name: decodeURIComponent(pathName),
						link: `/${path.slice(0, index + 1).join('/')}`,
					}
				}

				breadcrumb.active = index === path.length - 1;
				return breadcrumb;
			});
			
			this.setState({
				breadcrumbs,
			});
		}
	}

	onClick = (path) => {
		this.props.router.push(`/${path}`);
	};

	onBreadcrumbClick = (e) => {
		e.preventDefault();
		if(e.target.href){
			this.props.router.push(e.target.href.replace(window.location.origin, ''));
		}
	}

	render() {
		if (this.props.isLodaing) {
			return (
				<div className="loading">
					<img src="/loading.gif" alt="Loading..." />
				</div>
			);
		}
		
		return (
			<div className="container">
				<div className="breadcrumbs container">
					<Breadcrumb>
						{this.state.breadcrumbs.map(breadcrumb => (
							<BreadcrumbItem 
								href={breadcrumb.link} 
								active={breadcrumb.active} 
								key={breadcrumb.link}
								onClick={this.onBreadcrumbClick}
							>
								{breadcrumb.name}
							</BreadcrumbItem>
						))}
					</Breadcrumb>
				</div>

				<div className="files container">
					{this.props.files.map(file => {
						if (file.type === 'dir') {
							return <Folder 
								name={file.name} 
								path={file.path} 
								onClick={this.onClick}
								key={file.resource_id} 
							/>
						}

						return <File name={file.name} key={file.resource_id} />;
					})}

					{this.props.files.length === 0 && 
						<div className="empty-message">	
								There is nothing in this folder. To add files go&nbsp;
							<a href="https://disk.yandex.ru/client/disk" target="_blank" rel="noopener noreferrer">here</a>.
						</div>}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
  token: state.token,
  currentDirectory: state.currentDirectory.path,
  files: state.currentDirectory.files,
  isLodaing: state.currentDirectory.loading,
  router: ownProps.router,
  previousRoute: state.routing.locationBeforeTransitions.pathname,
});

const mapDispatchToProps = (dispatch) => ({
  setDirectory: (path, files) => dispatch(setDirectory(path, files)),
  setLoading: () => dispatch(setLoading()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);