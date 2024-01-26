#!/usr/bin/perl

my %X = map {my ($k,$v)=split(/=/,$_,2);$k=>($v=~s/%([0-9A-Fa-f]{2})/chr(hex($1))/egr)} split /&/, $ENV{QUERY_STRING};
my $callback = $X{'callback'};
my $flag = `echo 1 | ./debugme_fixed | grep 'flag{'`;
chomp $flag;
print "Content-type: application/javascript\n\n$callback('$flag')\n";
