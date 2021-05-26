import { assert } from 'chai'
import { input } from '@covid-policy-modelling/api'
import { convertOutput } from '../../src/convert-output'

const parameters: input.ModelParameters = {
  calibrationDate: '2020-03-05',
  calibrationCaseCount: 50,
  calibrationDeathCount: 50,
  interventionPeriods: [],
  r0: null,
}

suite('converting imperial model output to JSON', () => {
  test('returns a time series for each metric', () => {
    const testInput = {
      region: 'US',
      subregion: 'US-WY',
      parameters,
    }

    const tsv = `
t	S	I	R	incI	Mild	ILI	SARI	Critical	CritRecov	SARIP	CriticalP	CritRecovP	incMild	incILI	incSARI	incCritical	incCritRecov	incSARIP	incCriticalP	incCritRecovP	incDeath	incDeath_ILI	incDeath_SARI	incDeath_Critical	cumMild	cumILI	cumSARI	cumCritical	cumCritRecov	cumDeath	cumDeath_ILI	cumDeath_SARI	cumDeath_Critical
0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000
1.0000000000	640137.0000000000	91.0000000000	3.0000000000	44.0000000000	35.0000000000	13.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	7.0000000000	8.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	38.0000000000	13.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000	0.0000000000
2.0000000000	586487.0000000000	23141.0000000000	9849.0000000000	6208.0000000000	7712.0000000000	4136.0000000000	162.0000000000	48.0000000000	4.0000000000	113.4943766952	37.1279830042	3.9043549234	1607.0000000000	940.0000000000	40.0000000000	11.0000000000	4.0000000000	31.2679296614	19.9381842410	5.9411687385	5.0000000000	0.0000000000	4.0000000000	1.0000000000	13297.0000000000	7236.0000000000	330.0000000000	70.0000000000	13.0000000000	46.0000000000	0.0000000000	37.0000000000	9.0000000000
3.0000000000	262113.0000000000	32374.0000000000	333426.0000000000	1903.0000000000	8895.0000000000	4860.0000000000	774.0000000000	203.0000000000	46.0000000000	855.3267182504	226.6060068495	45.9566440203	988.0000000000	568.0000000000	85.0000000000	20.0000000000	27.0000000000	105.7167154683	75.4971073853	85.9622620960	55.0000000000	0.0000000000	35.0000000000	20.0000000000	156185.0000000000	86767.0000000000	8118.0000000000	2165.0000000000	985.0000000000	2904.0000000000	0.0000000000	1927.0000000000	977.0000000000
4.0000000000	234636.0000000000	3821.0000000000	397022.0000000000	193.0000000000	1055.0000000000	567.0000000000	114.0000000000	27.0000000000	6.0000000000	145.8340393105	31.5303300371	6.4028760500	119.0000000000	62.0000000000	7.0000000000	4.0000000000	2.0000000000	13.2674458351	10.5318230028	11.3783460560	7.0000000000	0.0000000000	3.0000000000	4.0000000000	171846.0000000000	95579.0000000000	9515.0000000000	2584.0000000000	1256.0000000000	3801.0000000000	0.0000000000	2500.0000000000	1301.0000000000
5.0000000000	231648.0000000000	83.0000000000	404711.0000000000	5.0000000000	21.0000000000	13.0000000000	2.0000000000	0.0000000000	1.0000000000	1.7761639784	0.4418278572	0.9038681979	1.0000000000	1.0000000000	1.0000000000	0.0000000000	1.0000000000	0.2679661247	0.0541842418	0.9215661582	0.0000000000	0.0000000000	0.0000000000	0.0000000000	173625.0000000000	96527.0000000000	9659.0000000000	2630.0000000000	1293.0000000000	3922.0000000000	0.0000000000	2585.0000000000	1337.0000000000
    `.trim()

    const result = convertOutput(testInput, tsv)

    assert.deepEqual(result.metadata, testInput)
    assert.deepEqual(result.time.timestamps, [0, 1, 2, 3, 4, 5])
    assert.deepEqual(result.time.extent, [0, 5])
    assert.deepEqual(result.aggregate.metrics['Mild'], [
      0,
      35,
      7712,
      8895,
      1055,
      21,
    ])
    assert.deepEqual(result.aggregate.metrics['Critical'], [
      0,
      0,
      48,
      203,
      27,
      0,
    ])
    assert.deepEqual(result.aggregate.metrics['incDeath'], [0, 0, 5, 55, 7, 0])
  })
})
