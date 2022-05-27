import { Box, Heading, Input, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { FormEvent, FormEventHandler, useState } from 'react';

import { Toaster } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toasts';
import { ButtonLink } from '../atoms/ButtonLink';
import { EmailIcon } from '../atoms/ClientIcons';

export function EmailListForm({ ...rest }) {
	const [email, setEmail] = useState('');
	const toast: Toaster = useToast();
	const handleSubmit: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		axios({
			url: '/api/signup/',
			method: 'POST',
			data: { email },
		})
			.then((response) => {
				if (response.status === 200) {
					showSuccessToast(
						'subscribed',
						{
							title: 'Thank you',
							description: `Sucessfully subscribed ${email} to newsletter`,
						},
						toast,
					);
				} else {
					showErrorToast(
						'subscribed',
						{
							title: 'Something went wrong',
							description: 'Please try again later',
						},
						{},
						toast,
					);
				}
			})
			.catch((error) => {
				showErrorToast(
					'subscribed',
					{
						title: 'Something went wrong',
					},
					error,
					toast,
				);
			});
	};

	return (
		<Box
			backgroundImage="url(/images/icon-email-list.png)"
			backgroundRepeat="no-repeat"
			backgroundPosition="middle left"
			backgroundSize="6rem"
			pl="8rem"
			textAlign="left"
			{...rest}
		>
			<Heading color="white" pt="0" fontSize="1.4rem" m="0">
				Alpha Signal Newsletter
			</Heading>
			<Text color="bodytext" fontSize="0.9rem" m="0.5rem 0">
				Sign up for insights on the crypto markets, delivered straight from our trading desk.
			</Text>
			<Box position="relative">
				<form id="emailForm" onSubmit={handleSubmit} method="post" target="_blank">
					<Input
						type="email"
						name="email"
						id="emailField"
						d="inline-block"
						placeholder="Email Address"
						backgroundColor="#110c19"
						borderRadius="2em"
						p="0.3rem 0.6rem 0.3rem 3rem"
						w="15rem"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<ButtonLink
						href="#"
						width="6rem"
						textAlign="center"
						variant="primary"
						display="inline-block"
						marginLeft="1rem"
						padding="0.25rem"
						onClick={handleSubmit}
					>
						Sign Up
					</ButtonLink>
					<EmailIcon
						position="absolute"
						left="0.7rem"
						top=".5rem"
						width="2rem"
						height="1.21rem"
						color="#aaa"
					/>
					{
						//real people should not fill this in and expect good things - do not remove this or risk form bot signups
					}
					<div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
						<input
							type="text"
							name="b_b7cf75761eafc2de03d5d5570_43b4351721"
							tabIndex={-1}
							defaultValue=""
						/>
					</div>
				</form>
			</Box>
		</Box>
	);
}

// Mailchimp raw
/*
<!-- Begin Mailchimp Signup Form -->
<link href="//cdn-images.mailchimp.com/embedcode/classic-10_7_dtp.css" rel="stylesheet" type="text/css">
<style type="text/css">
    #mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
    /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
       We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. /
</style>
<div id="mc_embed_signup">
<form action="https://capital.us5.list-manage.com/subscribe/post?u=b7cf75761eafc2de03d5d5570&amp;id=43b4351721" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">

<div class="indicates-required"><span class="asterisk"></span> indicates required</div>
<div class="mc-field-group">
    <label for="mce-EMAIL">Email Address  <span class="asterisk"></span>
</label>
    <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
</div>
<div class="mc-field-group">
    <label for="mce-FNAME">First Name </label>
    <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
</div>
<div class="mc-field-group">
    <label for="mce-LNAME">Last Name </label>
    <input type="text" value="" name="LNAME" class="" id="mce-LNAME">
</div>
<div class="mc-field-group size1of2">
    <label for="mce-BIRTHDAY-month">Birthday </label>
    <div class="datefield">
        <span class="subfield monthfield"><input class="birthday " type="text" pattern="[0-9]" value="" placeholder="MM" size="2" maxlength="2" name="BIRTHDAY[month]" id="mce-BIRTHDAY-month"></span> /
        <span class="subfield dayfield"><input class="birthday " type="text" pattern="[0-9]*" value="" placeholder="DD" size="2" maxlength="2" name="BIRTHDAY[day]" id="mce-BIRTHDAY-day"></span>
        <span class="small-meta nowrap">( mm / dd )</span>
    </div>
</div>    <div id="mce-responses" class="clear foot">
        <div class="response" id="mce-error-response" style="display:none"></div>
        <div class="response" id="mce-success-response" style="display:none"></div>
    </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_b7cf75761eafc2de03d5d5570_43b4351721" tabindex="-1" value=""></div>
        <div class="optionalParent">
            <div class="clear foot">
                <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">
                <p class="brandingLogo"><a href="http://eepurl.com/hM0e0f" title="Mailchimp - email marketing made easy and fun"><img src="https://eep.io/mc-cdn-images/template_images/branding_logo_text_dark_dtp.svg%22%3E</a></p>
            </div>
        </div>
    </div>
</form>
</div>
<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
<!--End mc_embed_signup-->
*/
