[![Build Status](https://travis-ci.org/mplauman/spent.svg?branch=master)](https://travis-ci.org/mplauman/spent)

# Spent

A simple personal finance website.

## What is Spent?

Spent is inspired by philosophies taken from agile software development, where
responding to change and short achievable goals are prioritized over detailed
planning.

It takes a fairly simple approach.

A running backlog of invoices represents expected costs and sources of income.
These include regular bills, one-off planned expenses, and expected paychecks.

Pay periods are represented as sprints - short periods of manageable time.
Whenever a sprint begins Spent will automatically include any invoices that
fall within that period of time and produce an expected closing balance.

There isn't any enforcment of anything: sprints don't need to line up, their
opening/closing balances don't need to match, etc. This is intentional: sprints
are intended to serve as a guide. They can be as accurate as you want.

## Why Spent?

Spent started life as a collection of shell scripts, during a time when my
paychecks (every two weeks) didn't line up with my mortgage payments (1st and
16th of the month). This was a real pain because sometimes it seemed like I had
far more money than I actualy did.

Those scripts served as an excellent source of inspiration to learn node.js,
React, and full-stack web development.
