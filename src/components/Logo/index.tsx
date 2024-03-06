import { type FunctionComponent } from "preact";

export interface LogoProps {
	class?: string;

	size?: number;

	primaryColor: string;

	secondaryColor: string;
}

export const Logo: FunctionComponent<LogoProps> = ({ class: className, size, primaryColor, secondaryColor }) => {
	return (
		<svg class={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32">
			<g clip-path="url(#clip)">
				<path
					d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
					fill={secondaryColor}
				/>
				<path
					d="M16 30.4C23.9529 30.4 30.4 23.9529 30.4 16C30.4 8.04707 23.9529 1.59998 16 1.59998C8.04711 1.59998 1.60001 8.04707 1.60001 16C1.60001 23.9529 8.04711 30.4 16 30.4Z"
					fill={primaryColor}
				/>
				<path
					d="M21.9465 10.9365L25.8884 11.6159L23.8501 23.4415L19.9082 22.7621L21.9465 10.9365Z"
					fill={secondaryColor}
				/>
				<path
					d="M8.14993 8.55847L12.0918 9.2379L10.0535 21.0635L6.11164 20.3841L8.14993 8.55847Z"
					fill={secondaryColor}
				/>
				<path
					d="M6.9946 9.37408L10.9365 10.0535L9.2379 19.9082L5.29603 19.2288L6.9946 9.37408Z"
					fill={secondaryColor}
				/>
				<path
					d="M22.7621 12.0918L26.704 12.7712L25.0054 22.6259L21.0635 21.9465L22.7621 12.0918Z"
					fill={secondaryColor}
				/>
				<path
					d="M8.28611 13.6557L24.0536 16.3734L23.7139 18.3443L7.94639 15.6266L8.28611 13.6557Z"
					fill={secondaryColor}
				/>
			</g>
			<defs>
				<clipPath id="clip">
					<rect width="32" height="32" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};
