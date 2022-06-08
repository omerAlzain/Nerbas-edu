/** @odoo-module **/

import {Portfolio} from '@slice03/portfolio/portfolio'
import {Event} from '@slice03/event/event'
import {About} from '@slice03/about/about'
import {Team} from '@slice03/team/team'
import {Contact} from '@slice03/contact/contact'
const { Component} = owl;

export class Home extends Component {}
Home.template = 'Home'

Home.components = { Portfolio, Event, About, Team, Contact }